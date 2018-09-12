export const centerGameObjects = objects => {
  objects.forEach(function(object) {
    object.anchor.setTo(0.5);
  });
};

export const getPlayerAnimationFrames = asset => {
  const frames = {
    idle: [],
    attack: [],
    "attack-2": [],
    hurt: [],
    die: []
  };
  if (asset._frameData && asset._frameData._frames) {
    asset._frameData._frames.forEach(frame => {
      let name = frame.name.split("/")[0].toLowerCase();
      name = name === "hit" ? "hurt" : name;
      frames[name].push(frame.index);
    });
    return frames;
  }
};
