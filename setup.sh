#!/bin/bash
export CONDA_ALWAYS_YES="true"
mkdir external
git clone https://github.com/explosion/spaCy.git ./external
git clone https://github.com/huggingface/neuralcoref.git ./external
conda create -n kamn python=3.7
conda install -n kamn anaconda
conda install -n kamn pytorch cpuonly -c pytorch
conda install ignite -c pytorch
conda install -n kamn -c gensim
unset CONDA_ALWAYS_YES 
conda init --all --dry-run --verbose
eval "$(command conda 'shell.bash' 'hook' 2> /dev/null)"
source activate kamn
pip install --no-cache-dir -U -r ./external/spacy/requirements.txt
python ./external/spaCy/setup.py build_ext --inplace
pip install --no-cache-dir -U -e ./external/spacy
cd ./external/neuralcoref
python ./external/neuralcoref/setup.py build_ext --inplace
pip install --no-cache-dir -U -e ./external/neuralcoref
python -m spacy download en_core_web_lg
pip install -U pytorch_transformers 
pip install -U tensorflow
pip install -U tensorboardX
pip install tensorflow_datasets
python -m spacy download en_core_web_lg
