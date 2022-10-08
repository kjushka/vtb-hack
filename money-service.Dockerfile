FROM python:3.10-alpine

RUN mkdir /money_service
WORKDIR /money_service

COPY /money-service ./

RUN apk add build-base && pip install wheel
RUN pip install -r requirements.txt

CMD ["python", "main.py"]