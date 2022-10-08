FROM python:3.10-alpine

WORKDIR /quest_service

COPY /quest-service ./

RUN apk add build-base && pip install wheel
RUN pip install -r requirements.txt

CMD ["python", "main.py"]