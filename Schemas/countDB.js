const { model, Schema } = require("mongoose");

module.exports = model("count", new Schema({
    GuildID: String,
    ChannelID: String,
    Count: Number,
    CountBy: String
}));