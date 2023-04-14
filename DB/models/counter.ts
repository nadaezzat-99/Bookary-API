import {Schema,model} from 'mongoose';
import { Counter } from '../schemaInterfaces';
const schema  = new Schema<Counter>({
    id:String,
    seq:{
        type:Number,
    },
},{
    timestamps:true
})

const Counter = model("counter",schema);

module.exports = Counter;