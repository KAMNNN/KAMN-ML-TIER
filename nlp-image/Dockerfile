FROM continuumio/anaconda3
RUN apt-get update && apt-get install -y libpq-dev build-essential git curl && rm -rf /var/lib/apt/lists/*
WORKDIR .
RUN conda update conda
RUN conda install python=3.7
RUN	conda install pytorch cpuonly ignite -c pytorch
RUN conda install -c conda-forge gensim
RUN conda init bash
RUN pip install -U pytorch_transformers 
RUN pip install -U tensorflow
RUN pip install -U --upgrade gensim
RUN pip install -U tensorboardX
RUN pip install -U neuralcoref
RUN pip install -U spacy
SHELL ["python", "-m", "spacy", "download", "en_web_core_lg"]
ENTRYPOINT ["conda", "run", "python", "app.py"]