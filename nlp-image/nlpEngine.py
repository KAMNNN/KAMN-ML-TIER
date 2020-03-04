import torch
import spacy
import neuralcoref
from pytorch_transformers import *
from gensim.parsing.porter import PorterStemmer
import question_generation.datasets as data
nlp = spacy.load("en_core_web_lg")
USE_COREF = False

if(USE_COREF):
    neuralcoref.add_to_pipe(nlp)

class nlp_engine:
    def __init__(self,):
        self.tokenizer   = BertTokenizer.from_pretrained("bert-base-uncased")
        self.model       = BertModel.from_pretrained("bert-base-uncased")
        self.use_coref = False
        self.vectorizer = data.vectorize('fast')
        self.stemmer = PorterStemmer()

    def make_multiple_choice(self, word, sentence, ai=False):
        if(len(word.split(' ')) == 1):
            if(word in sentence):
                most = self.vectorizer.most_similar(word.lower(), topn=20)
                choices = [x[0].lower() for x in most]
                tmp = list()
                tmp.append(word.lower())
                for x in choices:
                    if(x not in tmp):
                        tmp.append(x)
                return { "type":'mc', "question": sentence.replace(word, '______'), "answer": tmp[:4] }
            else:
                return None
        else:
            return None

    def fill_in_blank(self, word, sentence):
        if(word in sentence):
            return  { "type":'fb', "question": sentence.replace(word, '______'), "answer": word }
        else:
            return None

    def __call__(self, context):
        context_doc = nlp(context) 
        ents = context_doc.ents
        sentences_doc = [x.text for x in context_doc.sents]
        self.use_coref = USE_COREF and context_doc._.has_coref
        
        sentence_lengths = [len(sentences_doc[0])]
        for i in range(1, len(sentences_doc)):
            sentence_lengths.append(sentence_lengths[i-1] + len(sentences_doc[i]))
 
        ner_spans = list()
        for ent in ents: #use ner
            for i in range(len(sentence_lengths)):
                if(ent.start_char < sentence_lengths[i]):
                    ner_spans.append((ent.text, sentences_doc[i]))                    
        
        nn_spans = list()
        if(self.use_coref):
            for token in context_doc:
                if( (token.pos_ == 'PROPN' or token.pos_ == 'NOUN') and token._.in_coref):
                    for cluster in token._.coref_clusters:
                        nn_spans.append((token.text, cluster.main.text))

        sa_pairs = dict()
        for a,s in ner_spans + nn_spans:
            if(a not in sa_pairs):
                sa_pairs[a] = [s]
            elif(s != sa_pairs[a]):
                sa_pairs[a].append(s)

        qa_pairs = list()
        mc_pairs = list()
        for w,sents in sa_pairs.items():
            for s in sents:
                o = self.fill_in_blank(w,s)
                if(o != None):
                    qa_pairs.append(o)
                o = self.make_multiple_choice(w, s, False)
                if(o != None):
                    qa_pairs.append(o)
                    mc_pairs.append(o)
            
        print(len(qa_pairs))
        print(mc_pairs)
        return qa_pairs
       

def generate_question(transcript):
  eng = nlp_engine()
  eng(transcript)
  print(transcript)
  response = "{ challenge: { question: '3+4', choices; ['1', '2', '4', '7'], answer: '7'} }"
  return response

if __name__ == "__main__":
    eng = nlp_engine()
    eng('The Normans (Norman: Nourmands; French: Normands; Latin: Normanni) were the people who in the 10th and 11th centuries gave their name to Normandy, a region in France. They were descended from Norse ("Norman" comes from "Norseman") raiders and pirates from Denmark, Iceland and Norway who, under their leader Rollo, agreed to swear fealty to King Charles III of West Francia. Through generations of assimilation and mixing with the native Frankish and Roman-Gaulish populations, their descendants would gradually merge with the Carolingian-based cultures of West Francia. The distinct cultural and ethnic identity of the Normans emerged initially in the first half of the 10th century, and it continued to evolve over the succeeding centuries.')