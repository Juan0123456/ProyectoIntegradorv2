
const{Schema, model}=require ('mongoose');

const trabajoSchema = new Schema({
    titulo: String  ,
    descripcion:  String ,
    imageURL: String,
    public_id: String,
    user:String
});

module.exports = model('Trabajo',trabajoSchema);
