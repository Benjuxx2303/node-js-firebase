import firebase from '../firebase.js';
import Product from '../models/productModel.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const db = getFirestore(firebase);

/**
 * The `createProduct` function is an asynchronous function that handles the
 * creation of a product. It takes in three parameters: `req`, `res`, and `next`,
 * which are the request, response, and next middleware function respectively.
 * 
 * The function first tries to execute the code within the `try` block. It
 * retrieves the data from the request body using `req.body` and assigns it to the
 * `data` variable.
 * 
 * Then, it uses the `addDoc` function to add the `data` to the "products"
 * collection in the Firestore database. This function is asynchronous and returns
 * a promise, so `await` is used to wait for the promise to resolve before
 * proceeding.
 * 
 * If the document is successfully added, the function sends a response with a
 * status code of 200 and a message indicating that the product was created
 * successfully.
 * 
 * If an error occurs during the execution of the code within the `try` block, the
 * function catches the error in the `catch` block. It sends a response with a
 * status code of 400 and the error message as the response body.
 * 
 * Note: The code assumes that the `db` variable is a reference to the Firestore
 * database and the `addDoc` function is a valid function for adding a document to
 * a Firestore collection.
 */
export const createProduct = async (req, res, next) => {
  try {
    const data = req.body;
    await addDoc(collection(db, "products"), data);
    res.status(200).send("product created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
* This is an asynchronous function named `getProducts` that takes in three
* parameters: `req`, `res`, and `next`. It is typically used as a middleware
* function in an Express.js application.
* 
* The function attempts to retrieve documents from a Firestore collection named
* "products" using the `getDocs` function. It awaits the result of this
* asynchronous operation.
* 
* If the `products` collection is empty, the function sends a response with a
* status code of 400 and the message "No Products found".
* 
* If the `products` collection is not empty, the function iterates over each
* document using the `forEach` method. For each document, it creates a new
* `Product` object with properties extracted from the document's data (such as
* `id`, `name`, `price`, `retailer`, and `amountInStock`). The `Product` objects
* are then pushed into an array named `productArray`.
* 
* Finally, if the iteration is completed successfully, the function sends a
* response with a status code of 200 and the `productArray` as the response body.
* 
* If any error occurs during the execution of the function, it sends a response
* with a status code of 400 and the error message.
*/
export const getProducts = async (req, res, next) => {
  try {
    const products = await getDocs(collection(db, "products"));
    const productArray = [];

    if (products.empty) {
      res.status(400).send("No Products found");
    } else {
      products.forEach((doc) => {
        const product = new Product(
          doc.id,
          doc.data().name,
          doc.data().price,
          doc.data().retailer,
          doc.data().amountInStock
        );
        productArray.push(product);
      });

      res.status(200).send(productArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
* The `getProduct` function is an asynchronous function that handles a request to
* retrieve a product by its ID. It takes in three parameters: `req` (request),
* `res` (response), and `next` (next middleware function).
* 
* The function first extracts the `id` from the request parameters using
* `req.params.id`. It then creates a reference to the `products` collection in
* the Firestore database using the `doc` function, passing in the database
* instance (`db`) and the `id`.
* 
* Next, the function uses the `getDoc` function to asynchronously retrieve the
* document data from Firestore. The `await` keyword is used to wait for the
* promise to resolve and assign the result to the `data` variable.
* 
* If the document exists (checked using the `exists()` method), the function sends
* a response with a status code of 200 (OK) and the retrieved data using
* `res.status(200).send(data.data())`. Otherwise, if the document does not exist,
* the function sends a response with a status code of 404 (Not Found) and the
* message "product not found" using `res.status(404).send("product not found")`.
* 
* In case of any errors during the execution of the function, the catch block is
* triggered. It sends a response with a status code of 400 (Bad Request) and the
* error message using `res.status(400).send(error.message)`.
*/
export const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = doc(db, "products", id);
    const data = await getDoc(product);
    if (data.exists()) {
      res.status(200).send(data.data());
    } else {
      res.status(404).send("product not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
* The `updateProduct` function is an asynchronous function that handles the update
* of a product in a database. It takes in three parameters: `req`, `res`, and
* `next`, which represent the request, response, and next middleware function
* respectively.
* 
* The function begins by extracting the `id` parameter from the request's URL
* parameters and the `data` from the request's body. It then retrieves the
* specific product document from the "products" collection in the database using
* the `doc` function.
* 
* The `updateDoc` function is then called to update the retrieved product document
* with the provided data. This function is awaited to ensure that the update
* operation is completed before proceeding.
* 
* If the update is successful, a response with a status code of 200 and a message
* of "product updated successfully" is sent. If an error occurs during the update
* process, a response with a status code of 400 and the error message is sent.
* 
* Note: The code assumes the use of Firestore as the database and includes the
* necessary Firestore functions (`doc` and `updateDoc`) to interact with the
* database.
*/
export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const product = doc(db, "products", id);
    await updateDoc(product, data);
    res.status(200).send("product updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

/**
* The `deleteProduct` function is an asynchronous function that handles the
* deletion of a product. It takes in three parameters: `req`, `res`, and `next`,
* which represent the request, response, and next middleware function
* respectively.
* 
* The function first extracts the `id` parameter from the request parameters using
* `req.params.id`. It then uses the `deleteDoc` function from the Firestore
* library to delete the document with the specified `id` from the "products"
* collection.
* 
* If the deletion is successful, the function sends a response with a status code
* of 200 and a message indicating that the product was deleted successfully. If
* an error occurs during the deletion process, the function catches the error,
* sends a response with a status code of 400, and includes the error message in
* the response body.
*/
export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, "products", id));
    res.status(200).send("product deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

