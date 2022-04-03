import jwt from 'jsonwebtoken'

class AuthClient {
    verifyToken = (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            token = req.headers.authorization.split(" ")[1];
        } 
        if (!token) {
          return res.status(403).send({
            message: "No token provided!"
          });
        }
        jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
          if (err) {
            return res.status(401).send({
              message: "Unauthorized!"
            });
          }
          req.username = decoded.username;
          req.role = decoded.role;
          next();
        });
      };

      isUser = (req, res, next) => {
        if (req.role != 'USER') {
            return res.status(401).send({
                message: "Unauthorized!"
              }); 
        }
        next();
      };

      isCommentOwner = (req, res, next) => {
        if(req.username != req.body.from) {
          return res.status(401).send({
            message: "Unauthorized!"
          });
        }
        next();
      }

}

export default AuthClient;
