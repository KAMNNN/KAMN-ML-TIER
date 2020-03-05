FROM continuumio/anaconda3
RUN apt-get -qq update && apt-get install -y build-essential libpq-dev libssl-dev git curl groff && rm -rf /var/lib/apt/lists/*
WORKDIR .
RUN conda update conda
RUN conda install python=3.7 boto3
RUN	conda install pytorch cpuonly ignite -c pytorch
RUN conda install -c conda-forge gensim
RUN conda init bash
RUN pip install -U pytorch_transformers 
RUN pip install -U tensorflow
RUN pip install -U --upgrade gensim
RUN pip install -U tensorboardX
RUN pip install -U neuralcoref
RUN pip install -U spacy==2.1.9
RUN python3 -m spacy download en_core_web_lg
COPY . /
ENTRYPOINT ["python", "app.py"]
