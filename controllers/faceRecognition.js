const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");


const USER_ID = 'sabmus';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '';
const APP_ID = 'face-recognition';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
// This is optional.You can specify a model version or the empty string for the default
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';


const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);


const handlFaceRecognition = (req, res) => {
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version.
            inputs: [
                { data: { image: { url: req.body.imageUrl, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }
    
            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }
    
            // Since we have one input, one output will exist here.
            const output = response.outputs[0].data.regions;
            res.json(output);
        }
    );

}


module.exports = {
    handlFaceRecognition: handlFaceRecognition
}
