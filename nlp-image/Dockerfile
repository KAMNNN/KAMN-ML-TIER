FROM continuumio/miniconda
WORKDIR .
ADD ../setup.sh ./setup.sh

RUN apt-get update && apt-get install -y libpq-dev build-essential git \
	&& rm -rf /var/lib/apt/lists/*
RUN conda create -n kamn python=3.7 numpy anaconda gensim
RUN	conda install -n kamn pytorch cpuonly ignite -c pytorch
RUN conda update conda
RUN conda init bash

RUN sh ./setup.sh

ENTRYPOINT ["conda", "run", "-n", "kamn", "python", "app.py"]