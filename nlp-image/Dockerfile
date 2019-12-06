FROM python:3.7-slim

RUN apt-get -qq update && apt-get install -y build-essential \
    libssl-dev groff \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . /src

ENTRYPOINT ["python", "src/app.py"]
