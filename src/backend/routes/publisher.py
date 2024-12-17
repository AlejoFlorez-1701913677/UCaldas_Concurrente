import pika
import json

def send_registration_email(user_email: str, security_key: str):
    # Configuración de RabbitMQ
    print("Enviando correo de registro")
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    print("Conexión establecida")
    channel = connection.channel()
    print("Canal creado")
    print("Security key: ", security_key)

    # Declarar la cola en RabbitMQ
    channel.queue_declare(queue='user_registration_queue')
    print("Cola declarada")

    # Crear el mensaje que se enviará a RabbitMQ
    message = {
        "email": user_email,
        "security_key": security_key
    }
    print("Mensaje creado")

    # Enviar el mensaje a la cola
    channel.basic_publish(
        exchange='',
        routing_key='user_registration_queue',
        body=json.dumps(message)
    )
    print("Mensaje enviado")

    print(" [x] Sent registration email task")
    connection.close()
