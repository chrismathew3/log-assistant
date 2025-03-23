import { Router } from 'express';
import { LOG_ENDPOINT } from '../../constants/endpoint';

export const router: Router = Router();

router.get("/", (req, res) => {
  res.status(200).send({
    message: "GET request from sample router"
  });
});


// add new log
router.post(LOG_ENDPOINT + "/", (req, res) => {
  const plainTextData = req.body;
  console.log(plainTextData);
  res.status(200).send("Succcesfully recieved plain text");
})




