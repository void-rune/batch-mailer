# batch-mailer
Batch send emails to a subscriber list with nodemailer.

To use:

1) Rename `.env.example` to `.env` and edit the environment variables in that file to configure the batch send

2) Edit the `getNewsletterHTML` function so that it returns the html content that you want to send to the email subscribers

3) Edit the `subscribers.txt` file so that it contains your email subscriber list. Note that each subscriber has a unique token associated to them. The unique token can be used for example to unsubscribe specific subscribers.

4) Use the command `npm run send` to perform the batch send