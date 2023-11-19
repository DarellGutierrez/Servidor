const mongoose = require("mongoose");
const votacionSchema = new mongoose.Schema({
    nombreVotacion : {type: String, required: true},
    opcion1: {
        nombre: {type: String, required: true},
        votos: {type: Number, default: 0}
    },
    opcion2: {
        nombre: {type: String, required: true},
        votos: {type: Number, default: 0}
    },
    opcion3: {
        nombre: {type: String, required: true},
        votos: {type: Number, default: 0}
    },
    fecha: {type: String, default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })},
    fechaCierre: {type: String, required: true},
});

module.exports = mongoose.model("Votacion", votacionSchema);
