FROM continuumio/miniconda
RUN apt-get update && apt-get install -y libpq-dev build-essential \
&& rm -rf /var/lib/apt/lists/*
RUN conda create -n kamn python=3.7 numpy kamn anaconda gensim
RUN	conda install -n kamn pytorch cpuonly ignite -c pytorch
RUN conda install ignite -c pytorch
RUN source activate kamn
RUN pip install --upgrade pip
RUN	pip install --no-cache-dir -U spacy pytorch-transformers tensorflow tensorboardX
RUN pip install --no-cache-dir -U neuralcoref --no-binary neuralcoref


RUN python -m spacy download en_core_web_lg

CMD [ "/bin/bash" ]

ENTRYPOINT ["python", "app.py"]

