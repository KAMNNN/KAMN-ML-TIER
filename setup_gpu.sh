#!/bin/bash
export CONDA_ALWAYS_YES="true"
git clone https://github.com/explosion/spaCy.git ./external/spaCy
git clone https://github.com/huggingface/neuralcoref.git ./external/neuralcoref
conda create -n kamn python=3.7
conda install -n kamn anaconda
conda install -n kamn pytorch cudatoolkit=10.1 ignite-c pytorch
conda install -n kamn -c gensim
unset CONDA_ALWAYS_YES 
conda init --all --dry-run --verbose
eval "$(command conda 'shell.bash' 'hook' 2> /dev/null)"
source activate kamn
cd ./external/spacy
pip install -r requirements.txt
python setup.py build_ext --inplace
pip install -e .
cd ../neuralcoref
python setup.py build_ext --inplace
pip install -e .
cd ../..
python -m spacy download en_core_web_lg
pip install -U pytorch_transformers 
pip install -U tensorflow
pip install -U tensorboardX
pip install tensorflow_datasets
python -m spacy download en_core_web_lg
