import pika
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json
import random
import string

def generate_security_key(length=8) -> str:
    """Genera una llave de seguridad aleatoria."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

"""
def on_message(client, userdata, message):
    data = json.loads(message.payload.decode('utf-8'))
    email_address = data['email']
    access_key = data['access_key']
    
    msg = MIMEText(f'Utiliza esta llave para acceder al sistema: {access_key}')
    msg['Subject'] = 'Tu llave de acceso'
    msg['From'] = sender
    msg['To'] = email_address

    with smtplib.SMTP('smtp.example.com', 587) as server:
        server.starttls()
        server.login("user", "password")
        server.sendmail(sender, [email_address], msg.as_string())
        print(f"Correo enviado a {email_address}")
"""

def send_email(user_email: str, security_key: str):
    """Envía un correo electrónico con la llave de seguridad."""
    print(f"Enviando correo a {user_email}")
    sender_email = "listanegra@consensussa.com"
    sender_password = "Huv36844"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = user_email
    msg['Subject'] = "Tu llave de seguridad para el sistema"

    body = f"Hola,\n\nTu llave de seguridad para acceder al sistema es: {security_key}\n\nSaludos."
    msg.attach(MIMEText(body, 'plain'))

    try:
        print("Conectando al servidor de correo")
        server = smtplib.SMTP('outlook.office365.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, user_email, text)
        print("Correo enviado")
        server.quit()
        print(f"Correo enviado a {user_email}")
    except Exception as e:
        print(f"Error al enviar correo: {e}")

def callback(ch, method, properties, body):
    """Callback para procesar el mensaje recibido desde RabbitMQ."""
    message = json.loads(body)
    user_email = message["email"]
    security_key = generate_security_key()

    # Enviar el correo electrónico
    send_email(user_email, security_key)

# Conectar a RabbitMQ y consumir el mensaje
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='user_registration_queue')

channel.basic_consume(
    queue='user_registration_queue',
    on_message_callback=callback,
    auto_ack=True
)

print(' [*] Esperando mensajes. Para salir presiona CTRL+C')
channel.start_consuming()
