FROM python:3.10-alpine

RUN mkdir /auth_service
WORKDIR /auth_service

COPY /auth-service ./

RUN apk add build-base && pip install wheel
RUN pip install -r requirements.txt

CMD ["python", "main.py"]