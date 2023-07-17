
# PREREQUISITS

1. docker installed on your machine.

# INSTALLATION 


1. create network: 
> docker network create shared
2. run infras 
> docker run -d -it --rm --name rabbitmq --network shared -p 5672:5672 -p 15672:15672 rabbitmq:3.9-management 
3. run service and handlers: 
> docker-compose up -d --build