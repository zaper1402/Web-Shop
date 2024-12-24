# Web-Shop
Name : Ashir Kulshreshtha
Email : ashir.kulshreshtha@abo.fi

## Requirements Implemented
1. Project folder(MANDATORY):
2. Backend(Mandatory):
3. Frontend(MANDATORY):
4. AutomaticDBpopulation(MANDATORY):
5. Browse(MANDATORY):
6. Createaccount(MANDATORY):
7. Login(MANDATORY):
8. Add item(MANDATORY):
9. Addtocart(MANDATORY):
10. Search:
11. Removefromthecart:
12. Pay
13. Routing:
14. EditAccount:
15. Displayinventory:
16. Edititem:


## How to run the project 
### Backend
-- Use `python` or `python3` based on your path variable

`cd backend`

`pip install virtualenv`

`python -m venv venv`

`.\venv\Scripts\activate.bat` , on Linux : `source venv/bin/activate`

`pip install -r requirements.txt`

`python manage.py runserver`

### Frontend
`cd frontend`
`npm install`
`npm run dev`

# Note 
1) Test User 1 login credentials :
    email : testuser1@shop.aa
    password: pass1
2) **Item in sold category appear once they are completely sold out (0 in stock). 


## backend API to clear DB
curl --location 'http://127.0.0.1:8000/shop/deleteAll' \
--header 'Cookie: sessionid=eiwe4x6iatfmr4a0hfnycxz98zw5eh0p'

##Feedbacks:

1) Forgetting to upload image does not give error landing page -> goes to myitems view [Fixed now images are not compulsory and will not give error]
2) Landing page goes to MyItems view, populate item  not visible [This issue is not clear]
3) No error when failed login [Tested on edge its giving error toast when login fails]
4) Added products not visible in browse/search [Fixed]
5) Password update does not work [checked the password update worked fine for me]
6) Adding to basket does not work [Not sure what issue you are facing i was able to add to the basket]
7) Test User 1 login credentials not valid [email was earlier testuser1@shop.aa instead of testUser1@shop.aa]
8) Form not removed after adding product, page not redirected [Updated product fail will give error also page will auto refresh on product addition, the form was intentionally kept open to prevent hassle of clicking after each product addition] 
9) One migration was not created [Unable to see which migration was not created]

