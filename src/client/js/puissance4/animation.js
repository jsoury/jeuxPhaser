const animer = {
  animat: function (ligne, colonne) {
    let depart = -(
      document.querySelector(".plateau").clientHeight -
      (puissance4.nbLigne - ligne) * 100
    );
    let rafID = null;
    let force = -10;
    let pion = document.querySelector(`img[id='${ligne}${colonne}']`);
    const frame = () => {
      depart -= force;
      pion.style.transform = `translate3d(0, ${depart}px, 0)`;
      if (depart > -4) {
        cancelAnimationFrame(rafID);
        rafID = null;
        return;
      }
      rafID = requestAnimationFrame(frame);
    };
    rafID = requestAnimationFrame(frame);
  },
};
