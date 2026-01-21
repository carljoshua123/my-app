const Clearance = require("../models/Clearance");
const createBlock = require("../blockchain/ledger");

exports.requestClearance = async (req, res) => {
  const last = await Clearance.findOne().sort({ _id: -1 });
  const previousHash = last ? last.hash : "GENESIS";

  const block = createBlock(req.body, previousHash);

  const clearance = new Clearance({
    ...req.body,
    ...block,
    timestamp: new Date()
  });

  await clearance.save();
  res.json(clearance);
};

exports.verifyClearance = async (req, res) => {
  const clearance = await Clearance.findById(req.params.id);
  if (!clearance) return res.status(404).json({ msg: "Not found" });

  const check = createBlock(
    { citizenId: clearance.citizenId, agency: clearance.agency },
    clearance.previousHash
  );

  res.json({
    valid: check.hash === clearance.hash
  });
};
