import boto3
dynamodb = boto3.resource('dynamodb', aws_access_key_id ='ASIARPLUGLOKYAMIVYLF',aws_secret_access_key='Jc8ViCDdN4R5MDCBj9NJM5/IiJzTLJki8gqxfnhc',aws_session_token='FwoGZXIvYXdzENX//////////wEaDAc+rRkTCF1JUiG6ACK/AaCnE4sqHzv610m53p6nauh7cTZYfA3LeR98GPLzZbOz7ba+BsZmYCGGAJeyGdmJf71+tJU8mBSrl/W7waqtoUUkUEBMywJDWDJk66lvID71eQAPqMK/mcviGlrHTHrFE6bizUTUTpMY8c4+vlPTU6VSUIcFiSeowGeGP91GstAPN5jrIC3O8X/kTJ4qa7Bf7LP/sOJHF18GhPCSyFfGKYdmWs2L7OoIssBupnwosPCoKiSniZZk0EgV7ilZBvvIKLq1u40GMi0jNxdK/LsQXifL2Nq4TpcUfh9z3OrJnkCsTR1hx+iTvryEhzXv8XycWtQBWLg=')
def lambda_handler(event, context):
    intent=(event['currentIntent']['name'])
    userId=(event['currentIntent']['slots']['Registered'])
    if intent=="registereduser":
        response = {
        "sessionAttributes": event['sessionAttributes'],
        "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
        "contentType": "PlainText",
        "content": ""
        }
        }
        };
        response["dialogAction"]["message"]["content"]=getUserId(userId)
        return response
        
def getUserId(userId):
    table = dynamodb.Table('box')
    response = table.scan()
    docs = response['Items']
    for items in docs:
       users=items['members']
       if userId in users:
           
           return f"Your boxId is {items['boxId']}  and your safe deposit balance is {items['balance']}"
        else:
            return "User Id not found"