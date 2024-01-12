import { Schema, model, Types } from "mongoose";
import { MapDocument } from "../types/documents.types";

const MapSchema = new Schema<MapDocument>({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  blogId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Map = model("map", MapSchema);

export default Map;
