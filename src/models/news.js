const { Schema, model } = require("mongoose");

const newsShema = new Schema(
    {   
        title: {
            type: String,
            required: [true],
        },
        url: {
            type: String,
        },
        description: {
            type: String,
        },
        date: {
            type: Date,
        }
    }, {versionKey:false, timestamps:true}
)

const News = model("news", newsShema);

module.exports = News;