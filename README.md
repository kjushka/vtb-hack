### System for vtb more tech 4.0

## Сборка и запуск
1. Установить необходимое ПО
    1. Docker, Docker-Compose ([Docker](https://docs.docker.com/engine/install/ubuntu/), [Docker-Compose](https://docs.docker.com/compose/install/))
    2. Добавить Docker в группу ([Docker](https://itsecforu.ru/2018/04/12/как-использовать-docker-без-sudo-на-ubuntu/) 1-й вариант)
    3. Установить make командой sudo apt-get install make
2. Перейти в директорию проекта
3. Для поднятия сервера используется команда make run
4. Для остановки работы сервера - make stop
5. Для удаления контейнеров - make down
6. Логи можно посмотреть с помощью команды make logs
7. Сервер auth запускается по адресу localhost:8000
8. Сервер market запускается по адресу localhost:8080
9. Сервер user запускается по адресу localhost:8081
10. Сервер money запускается по адресу localhost:8082
11. Фронт localhost:3000/next

Самая свежая версия фронта ([здесь](https://github.com/vpasport/vtb-hack))
Посмотреть замоканный фронт ([здесь](http://82.146.55.184/next)) (логин/пароль любые)