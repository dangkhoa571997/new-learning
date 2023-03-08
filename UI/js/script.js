(function () {
  const $ = function (id) {
    return document.getElementById(id)
  }
  let ele
  let container
  let canvas
  let num
  let prizes
  let spinBtn
  let deg = 0
  let fnGetPrize
  let fnGotBack
  let optsPrize

  let cssPrefix
  let eventPrefix
  const vendors = {
    '': '',
    Webkit: 'webkit',
    Moz: '',
    O: 'o',
    ms: 'ms'
  }
  const testEle = document.createElement('p')
  let cssSupport = {}

  Object.keys(vendors).some(function (vendor) {
    if (
      testEle.style[vendor + (vendor ? 'T' : 't') + 'ransitionProperty'] !==
      undefined
    ) {
      cssPrefix = vendor ? '-' + vendor.toLowerCase() + '-' : ''
      eventPrefix = vendors[vendor]
      return true
    }
    return false
  })

  function normalizeEvent (name) {
    return eventPrefix ? eventPrefix + name : name.toLowerCase()
  }

  function normalizeCss (name) {
    name = name.toLowerCase()
    return cssPrefix ? cssPrefix + name : name
  }

  cssSupport = {
    cssPrefix,
    transform: normalizeCss('Transform'),
    transitionEnd: normalizeEvent('TransitionEnd')
  }

  const transform = cssSupport.transform
  const transitionEnd = cssSupport.transitionEnd

  function init (opts) {
    fnGetPrize = opts.getPrize
    fnGotBack = opts.gotBack
    opts.config(function (data) {
      prizes = opts.prizes = data
      num = prizes.length
      draw(opts)
    })
    events()
  }

  function draw (opts) {
    opts = opts || {}
    if (!opts.id || num >>> 0 === 0) return

    const id = opts.id
    const rotateDeg = 360 / num / 2 + 90
    const prizeItems = document.createElement('ul')
    const turnNum = 1 / num
    const html = []
    const pinRotateDeg = 360 / num
    const firstAngle = pinRotateDeg / 2

    ele = $(id)
    canvas = ele.querySelector('.circle-canvas')
    container = ele.querySelector('.circle-container')
    spinBtn = ele.querySelector('.spin-btn')

    if (!canvas.getContext) {
      showMsg('Browser is not support')
      return
    }

    const ctx = canvas.getContext('2d')

    for (let i = 0; i < num; i++) {
      ctx.save()
      ctx.beginPath()
      ctx.translate(250, 250) // Center Point
      ctx.moveTo(0, 0)
      ctx.rotate((((360 / num) * i - rotateDeg) * Math.PI) / 180)
      ctx.arc(0, 0, 250, 0, (2 * Math.PI) / num, false) // Radius
      if (i % 2 === 0) {
        ctx.fillStyle = '#FDF0B9'
      } else {
        ctx.fillStyle = '#F6CB18'
      }
      ctx.fill()
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = "#f65d79";
      // ctx.stroke();
      ctx.restore()
      const prizeList = opts.prizes
      html.push('<li class="second-circle-item">')
      html.push('<span style="')
      html.push(transform + ': rotate(' + i * turnNum + 'turn)">')
      if (opts.mode === 'both') {
        html.push("<p id='curve'>" + prizeList[i].text + '</p>')
        html.push('<img src="' + prizeList[i].img + '" />')
      } else if (prizeList[i].img) {
        html.push('<img src="' + prizeList[i].img + '" />')
      } else {
        html.push('<p id="curve">' + prizeList[i].text + '</p>')
      }
      html.push('</span>')
      html.push(
        `<span class="pin" style="transform: rotate(${
          (i + 1) * pinRotateDeg - firstAngle
        }deg)" ></span>`
      )
      html.push('</li>')
      if (i + 1 === num) {
        prizeItems.className = 'second-circle-list'
        container.appendChild(prizeItems)
        prizeItems.innerHTML = html.join('')
      }
    }
  }

  function showMsg (msg) {
    alert(msg)
  }

  function runRotate (deg) {
    container.style[transform] = 'rotate(' + deg + 'deg)'
  }

  function events () {
    bind(spinBtn, 'click', function () {
      addClass(spinBtn, 'disabled')

      fnGetPrize(function (data) {
        if (data[0] == null && !data[1] == null) {
          return
        }
        optsPrize = {
          prizeId: data[0],
          chances: data[1]
        }
        deg = deg || 0
        deg = deg + (360 - (deg % 360)) + (360 * 10 - data[0] * (360 / num))
        runRotate(deg)
      })
      bind(container, transitionEnd, eGot)
    })
  }

  function eGot () {
    if (optsPrize.chances == null) {
      return fnGotBack(null)
    } else {
      removeClass(spinBtn, 'disabled')
      return fnGotBack(prizes[optsPrize.prizeId].text)
    }
  }

  function bind (ele, event, fn) {
    if (typeof addEventListener === 'function') {
      ele.addEventListener(event, fn, false)
    } else if (ele.attachEvent) {
      ele.attachEvent('on' + event, fn)
    }
  }

  function hasClass (ele, cls) {
    if (!ele || !cls) return false
    if (ele.classList) {
      return ele.classList.contains(cls)
    } else {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    }
  }

  function addClass (ele, cls) {
    if (ele.classList) {
      ele.classList.add(cls)
    } else {
      if (!hasClass(ele, cls)) ele.className += '' + cls
    }
  }

  function removeClass (ele, cls) {
    if (ele.classList) {
      ele.classList.remove(cls)
    } else {
      ele.className = ele.className.replace(
        new RegExp(
          '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      )
    }
  }

  const luckyWheel = {
    init: function (opts) {
      return init(opts)
    }
  }

  window.luckyWheel === undefined && (window.luckyWheel = luckyWheel)
})()
