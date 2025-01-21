curl --location --request POST 'https://noble-server-1023314501312.us-east1.run.app/v1/update_journal_detail' \
--header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBhYmQzYTQzMTc4YzE0MjlkNWE0NDBiYWUzNzM1NDRjMDlmNGUzODciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTXVycmF5IFRvZXdzIiwiYWRtaW4iOnRydWUsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9jb25kby1tZ210IiwiYXVkIjoiY29uZG8tbWdtdCIsImF1dGhfdGltZSI6MTczNDczNzIxMSwidXNlcl9pZCI6Ilk4bFJjaWpPNTZZZmJyeDFNMGVCQ1pVZXNmbzIiLCJzdWIiOiJZOGxSY2lqTzU2WWZicngxTTBlQkNaVWVzZm8yIiwiaWF0IjoxNzM3NDgzMzY3LCJleHAiOjE3Mzc0ODY5NjcsImVtYWlsIjoibXN0b2V3c0Bob3RtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJtc3RvZXdzQGhvdG1haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.JcSsUiqFY2KgxvDBJdxFkyltSHIuiN5ZsFRchr1yJHoIFNzlYSLs8V0KuLIPaPrPWvKAgx5prLmKboU36HFvVJwiUDjFevSyMjVsz8-5InKJM-u5KZLmk0IuCrYEq85LED6q3NwbIvZzcZjksvpmSe_JsUTGCBc6vp4gWP00-ZwZgITq1X1X4TDCL9cOtzVA3LhBKHuSYmkpZ8k3zdIUn5QS7ryGTNekYNnrdWDGTdHa1mplC_TgiHUDgfZER5ECE-QoubSsQTCYC_IJnt9xOWLFzgOeWPXNZbvCJZIrjy8GKOspAS1iINl1FQXTwQGUHuMzSctQ1snUi2_UflkPsQ' \
--header 'Content-Type: application/json' \
--data-raw '{
"journal_id": 165,
"journal_subid": 2,
"account": 5000,
"child": 5030,
"child_desc": "Interest Revenue",
"sub_type": "Operating",
"description": "Line",
"debit": 0,
"credit": 1500.00,
"create_date": "2024-05-21",
"create_user": "mstoews@hotmail.com",
"fund": "Reserve",
"reference": "#Reference No 23",
"period": 1,
"period_year": 2024,
"template_name": "Water"
}
'