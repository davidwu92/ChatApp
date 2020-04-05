module.exports = (model, Schema) =>{
  // DUMMY MODEL
  const WebApp = new Schema({
    title: String,
    description: String,
    link: String,
    createdAt: {type: Date, default: Date.now}
  })
  WebApp.index({title: 'text'})

  return model('WebApp', WebApp)
}