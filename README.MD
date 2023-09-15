### <h1>E-Commerce API</h1>

An API that contains: <br>
*register,login, logout functionality. (using Json Web Token and cookies) <br>
*admin role and restriction functions for normal users <br>
*CRUD functions and special routes for User, Product, Review, and Order models. <br>
*documentation created with <a href="https://github.com/thedevsaddam/docgen">docgen</a> <br>
*security with "helmet", "express-rate-limiter", "xss-clean", "cors", and "express-mongo-sanitize".
 
<h3><a href="https://ecommerceapi-zwqi.onrender.com/">documentation link</a></h3>

### <h2>Setup </h2>

1. Setup .env in the root <br>
2. Add MONGO_URL with correct value <br>
3. Add JWT_SECRET as your resolving key(e.g thisIsASecretKey) and JWT_LIFETIME as the expire time of the token (e.g 1d,30d) <br>
4. navigate to the root directory (which contains "package.json"), and run the command below <br>

```bash
npm install && npm start
```
<br>
