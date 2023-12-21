import {Pinecone , Vector} from '@pinecone-database/pinecone'
import { log } from 'console';
import { downlaodFromS3 } from './s3-server';
import {PDFLoader} from 'langchain/document_loaders/fs/pdf';
import md5 from 'md5';
import { Document  , RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter';
import { getEmbeddings } from './embeddings';

let pinecone : Pinecone | null = null;

export const getPineconeClient = async() => {
    if(!pinecone){
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
            environment: process.env.PINECONE_ENVIRONMENT!,
        });

    }
    return pinecone;
}

type PDFPage = {
    pageContent : string;
    metadata : {
        loc : {PageNumber : number};
    }

}
export async function loadS3IntoPinecone(fileKey : string){
    //1 -> obtain the pdf from s3  -> download the pdf and then read from it 

    log("Loading s3 into fileSystem");

    const file_name = await downlaodFromS3(fileKey);
    // we are extraxxting the text from the pdf using langchain
    if(!file_name){
        throw new Error("Error in downloading the file");
    }

    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];         //return us with all the pages in the pdf
    // 2.  split and segment the pdf into segments -> pages -> paragraphs -> sentences.
    const documents = await Promise.all(pages.map(prepareDocument)); // we are mapping over the pages and then preparing the document for each page

    return pages ;
}

async function embedDocument(doc : Document){
    //getting the embeddings for the document using openAi
    try{
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent)
        return {
            id : hash,
            values : embeddings,
            metadata : {
                text : doc.metadata.text,
                pageNumber : doc.metadata.pageNumber
            }

        } as Vector;

    }
    catch(error){
        console.log('error in embedding the document',error);
        throw error;
        
    }
}
export const turncateStringByBytes = (str : string , bytes : number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0,bytes)); // we are converting the string into bytes and then slicing it
}

async function prepareDocument(page : PDFPage){
    let  {pageContent , metadata} = page;
    pageContent = pageContent.replace(/\n/g,'');
    //split the docs 
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = splitter.splitDocuments([
        new Document({
            pageContent,
            metadata : {
                pageNumber : metadata.loc.PageNumber,
                text : turncateStringByBytes(pageContent , 36000) // because we have a limit of 36kb in pinecone
            }
        })
    ]);
    return docs; // return the small paragraphs 
}


