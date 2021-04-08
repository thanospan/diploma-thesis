'use strict';

exports.buildPipeline = (policy) => {
  let pipeline = [];

  if (!policy) {
    pipeline = [
      { $unset: ["_id", "__v", "updated", "created"] }
    ];

    return pipeline;
  }

  if (policy.excluded.length !== 0) {
    pipeline.push({ $unset: policy.excluded });
  }

  return pipeline;
};
