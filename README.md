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
    email : testUser1@shop.aa
    password: pass1
2) **Item in sold category appear once they are completely sold out (0 in stock). 


## backend APIto clear DB
curl --location 'http://127.0.0.1:8000/shop/deleteAll' \
--header 'Cookie: sessionid=eiwe4x6iatfmr4a0hfnycxz98zw5eh0p'