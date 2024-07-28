node_modules/fkill-cli/cli.js -f :3001 &> /dev/null || true
nohup yarn run user-pub &> /dev/null &
node_modules/fkill-cli/cli.js -f :5001 &> /dev/null || true
nohup yarn run email-sub &> /dev/null &
sleep 2s
# newman run pubsub.postman_collection.json
curl --location 'localhost:3001/api/user/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "name": "Suthinan Musitmani",
    "username": "potaesm",
    "email": "potaesm@gmail.com",
    "phone": "0812345678"
}'
curl --location --request POST 'localhost:5001/api/email/pull'
node_modules/fkill-cli/cli.js -f :3001
node_modules/fkill-cli/cli.js -f :5001