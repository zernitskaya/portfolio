(function() {
   function lightBox(gallery) {
       const imgWrap = document.querySelector(gallery);
       if(!imgWrap) return;
       const imgLightbox = document.querySelector('.js-lightbox__img');
       const lightbox = document.querySelector('.js-lightbox');
       const lightClose = document.querySelector('.js-lightbox-close');
       const lightCloseBtn = document.querySelector('.js-lightbox-close-btn');
       const img = '.gallery__img';
       const itemClass = 'gallery__item';
       const buttonLeft = document.querySelector('.js-left');
       const buttonRight = document.querySelector('.js-right');
       const itemGallery = imgWrap.querySelectorAll('.'+itemClass);
       let prev;
       let next;

       imgWrap.addEventListener('click', function(e) {
           let gallery = isClosest(e.target, itemClass);

           if (gallery) {
               lightbox.classList.add('active');

               const urlImg = gallery.querySelector(img).getAttribute('src');
               imgLightbox.setAttribute('src', urlImg);
           }
       });

       buttonLeft.addEventListener('click', function() {
           const urlImg = imgLightbox.getAttribute('src');
           const arrThisImg = Array.prototype.slice.call(itemGallery);

           const filterItem = arrThisImg.filter(function(item) {
               return item.querySelector(img).getAttribute('src') === urlImg;
           });

           newArrfunction(filterItem[0]);

           if(!prev[0]) { return }
           imgLightbox.setAttribute('src', prev[0]);
       });

       buttonRight.addEventListener('click', function() {
           const urlImg = imgLightbox.getAttribute('src');
           const arrThisImg = Array.prototype.slice.call(itemGallery);

           const filterItem = arrThisImg.filter(function(item) {
               return item.querySelector(img).getAttribute('src') === urlImg;
           });

           newArrfunction(filterItem[0]);

           if(!next[0]) { return }
           imgLightbox.setAttribute('src', next[0]);
       });

       lightClose.addEventListener('click', function() {
           lightbox.classList.remove('active');
       });

       lightCloseBtn.addEventListener('click', function() {
           lightbox.classList.remove('active');
       });

       function newArrfunction(itemGal) {
           prev = isSiblingPrev(itemGal,'gallery__item').map( function(item) {
               return item.querySelector(img).getAttribute('src');
           });

           next = isSiblingNext(itemGal,'gallery__item').map( function(item) {
               return item.querySelector(img).getAttribute('src');
           });
       }
   }

    lightBox('.gallery');

    function isSiblingPrev(tag, classItem) {
        let arr = [];
        let prev = tag;

        if (!tag) return;

        for (;true;) {
            if (!prev) {
                break;
            }

            prev = prev.previousElementSibling;

            if (prev && prev.classList.contains(classItem)) {
                arr.push(prev);
            }
        }

        return arr;
    }

    function isSiblingNext(tag, classItem) {
        let arr = [];
        let next = tag;

        if (!tag) return;

        for (;true;) {
            if (!next) {
                break;
            }

            next = next.nextElementSibling;

            if (next && next.classList.contains(classItem)) {
                arr.push(next);
            }
        }

        return arr;
    }
})();
(function() {
    const menu = document.querySelector('.js-acordion-wrap');
    const itemClass = 'acordion__title';

    if (menu) {
        menu.addEventListener('click', function(e) {
            const el = isClosest(e.target, itemClass);

            if(el && el.classList.contains(itemClass)) {
                el.parentElement.classList.toggle('active');
            }
        });
    }
})();

(function() {
    const body = document.querySelector('body');
    const modals = document.querySelectorAll('[data-modal-name]');
    let count = 0;

    document.addEventListener('click', function(e) {
        const elemStatus = isClosestSet(e.target, 'data-modal-open');
        const closeModal = isClosestSet(e.target, 'data-modal-close');
        if (elemStatus) {
            for (let i = 0; i < modals.length; i++) {
                if (elemStatus.dataset.modalOpen === modals[i].dataset.modalName) {
                    modals[i].classList.add('active');
                    body.classList.add('fixed');

                    count = count + 1;
                }
            }
        }

        if (closeModal) {
            for (let i = 0; i < modals.length; i++) {
                if (closeModal.dataset.modalClose === modals[i].dataset.modalName) {
                    modals[i].classList.remove('active');

                    count = count - 1;

                    if (count <= 0) {
                        body.classList.remove('fixed');
                    }
                }
            }
        }
    });
})();

function isClosestSet(eventTarget, thisElem) {
    let result = false;

    if (!thisElem || !eventTarget) return false;

    if (eventTarget.getAttribute(thisElem)) {
        return eventTarget;
    }

    for (;true;) {
        eventTarget = eventTarget.parentElement;

        if (!eventTarget) {
            result = false;
            break;
        }

        if (eventTarget.getAttribute(thisElem)) {
            result = eventTarget;
            break;
        }
    }

    return result;
}

function isClosest(eventTarget, thisElem) {
    let result = false;
    if (!thisElem || !eventTarget) return false;

    if (eventTarget.classList.contains(thisElem)) {
        return eventTarget;
    }

    for (;true;) {
        eventTarget = eventTarget.parentElement;

        if (!eventTarget) {
            result = false;
            break;
        }

        if (eventTarget.classList.contains(thisElem)) {
            result = true;
            break;
        }
    }

    return eventTarget;
}