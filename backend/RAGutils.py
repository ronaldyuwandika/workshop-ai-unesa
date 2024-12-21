import os
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnableMap
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])


def isEmpty(path): 
    if os.path.exists(path) and not os.path.isfile(path): 
        # Checking if the directory is empty or not 
        if not os.listdir(path): 
            return True
        else: 
            return False

def load_pdf_create_vector(folder_path):
    loader = DirectoryLoader(
      folder_path, 
      glob="**/*.pdf", 
      loader_cls=PyPDFLoader,
      recursive=True
    )
    documents = loader.load()
    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    texts = text_splitter.split_documents(documents)
    # Create embeddings and vector store
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectorDB = FAISS.from_documents(texts, embeddings)
    vectorDB.save_local("vector_db")

def create_qa_chain(db):
    prompt_template = """Please provide a detailed answer based on the context given. If the context does not contain the answer, simply state, 
    "The answer is not available in the provided context." Please do not guess.\n\n
    Context:\n {context}\n
    Question:\n {question}\n

    Answer:
    """
    prompt = ChatPromptTemplate.from_template(prompt_template)
    output_parser = StrOutputParser()
    llm =  ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.2)

    chain = RunnableMap({
        "context": lambda x: db.similarity_search(x["question"]),
        "question": lambda x: x["question"]
    }) | prompt | llm | output_parser
    return chain

def get_response_final(query):
    embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    faiss_db = FAISS.load_local("vector_db", embedding_model, allow_dangerous_deserialization=True)
    chain = create_qa_chain(faiss_db)
    result = chain.invoke({"question": query})
    return result 

if __name__ == "__main__":
    load_pdf_create_vector("data")
    print(get_response_final("What is Gemma ?"))
