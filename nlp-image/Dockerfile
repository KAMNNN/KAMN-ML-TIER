FROM continuumio/miniconda
WORKDIR .
RUN apt-get update && apt-get install -y libpq-dev build-essential \
	&& rm -rf /var/lib/apt/lists/*
RUN conda create -n kamn python=3.7 numpy anaconda gensim
RUN	conda install -n kamn pytorch cpuonly ignite -c pytorch
RUN conda update conda
RUN conda init bash
SHELL ["conda", "run", "-n", "kamn", "/bin/bash", "-c"]
RUN pip install --upgrade pip
RUN	pip install --no-cache-dir -U spacy pytorch-transformers tensorflow tensorboardX gsutil
RUN pip install --no-cache-dir -U neuralcoref --no-binary neuralcoref
RUN python -m spacy download en_core_web_lg
ENTRYPOINT ["conda", "run", "-n", "kamn", "python", "app.py"]