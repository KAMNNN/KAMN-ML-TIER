FROM continuumio/miniconda
WORKDIR .
RUN apt-get update && apt-get install -y libpq-dev build-essential git \
	&& rm -rf /var/lib/apt/lists/*
RUN conda create -n kamn python=3.7 numpy anaconda gensim
RUN	conda install -n kamn pytorch cpuonly ignite -c pytorch
RUN conda update conda
RUN conda init bash
RUN git clone https://github.com/explosion/spaCy.git 
RUN git clone https://github.com/huggingface/neuralcoref.git

SHELL ["conda", "run", "-n", "kamn", "/bin/bash", "-c"]
RUN pip install --upgrade pip
RUN python -m pip install -U pip

RUN pip install --no-cache-dir -U -r ./spacy/requirements.txt
RUN python setup.py build_ext --inplace
RUN pip install --no-cache-dir -U -e ./spacy
RUN cd ./neuralcoref
RUN python ./neuralcoref/setup.py build_ext --inplace
RUN pip install --no-cache-dir -U -e ./neuralcoref
RUN python -m spacy download en_core_web_lg

RUN	pip install --no-cache-dir -U pytorch-transformers tensorflow tensorboardX gsutil

ENTRYPOINT ["conda", "run", "-n", "kamn", "python", "app.py"]