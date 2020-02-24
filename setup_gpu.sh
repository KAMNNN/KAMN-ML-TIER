#!/bin/bash
export CONDA_ALWAYS_YES="true"
mkdir external
git clone https://github.com/explosion/spaCy.git ./external/spaCy
git clone https://github.com/huggingface/neuralcoref.git ./external/neuralcoref
conda create -n kamn python=3.7
conda install -n kamn anaconda
conda install -n kamn pytorch cudatoolkit=10.1 ignite -c pytorch

unset CONDA_ALWAYS_YES 
conda init --all --dry-run --verbose
eval "$(command conda 'shell.bash' 'hook' 2> /dev/null)"
source activate kamn
cd ./external/spaCy
pip install -r requirements.txt
python setup.py build_ext --inplace
pip install -U -e .
cd ../neuralcoref
python setup.py build_ext --inplace
pip install -U -e .
cd ../..
python -m spacy download en_core_web_lg
pip install -U pytorch_transformers 
pip install -U --upgrade gensim
pip install -U tensorflow
pip install -U tensorboardX
python -m spacy download en_core_web_lg
