// เขียนด้วยความเร่งรีบ โค้ดไม่สวยโปรดอภัย

const SECOND = 1000

new Vue({
  el: '#clock',
  data () {
    return {
      // timer
      distance: 0,
      status: 'stop',
      last: new Date().getTime(),
      // settings
      showing: false
    }
  },
  computed: {
    isPanicTime () {
      return this.distance < 30 * SECOND && this.status === 'running'
    },
    timeLeft () {
      const s = parseInt((this.distance / 1000) % 60)
      const m = parseInt(((this.distance / (1000 * 60)) % 60))
      const h = parseInt(((this.distance / (1000 * 60 * 60)) % 24))
      if (this.distance <= 0) {
        return `Time's Up!!`
      } else if (h > 0) {
        console.log(h)
        return `${h} Hour ${m} Minute ${s} Second`
      } else if (m > 0) {
        return `${m} Minute ${s} Second`
      } else {
        return `${s} Second`
      }
    },
    startStopState () {
      switch (this.status) {
        case 'running': return 'Stop'
        case 'pause': return 'Stop'
        case 'stop': return 'Start'
      }
    },
    pauseResumeState () {
      switch (this.status) {
        case 'running': return 'Pause'
        case 'pause': return 'Resume'
        case 'stop': return 'Pause'
      }
    }
  },
  mounted () {
    this.load()
    this.resumeOperation()
    window.addEventListener('keypress', e => {
      console.log(e)
      switch (e.key) {
        case 'z': case 'ผ': // start / stop
          this.startStop()
          break
        case ' ': // spacebar for pause / resume
          this.pauseResume()
          break
      }
    })
    window.addEventListener("beforeunload", this.save)
    // window.addEventListener('blur', () => {
    //   this.save()
    // })
    // window.addEventListener('focus', () => {
    //   this.load()
    //   this.resumeOperation()
    // })
  },
  methods: {
    toggleSetting () {
      this.showing = !this.showing
    },
    onFinish () {
      console.log('finished')
    },
    resumeOperation () {
      if (this.status === 'running') {
        this.start()
      }
    },
    update () {
      const elapsedTime = new Date().getTime() - this.last
      this.distance = this.distance - elapsedTime
      if (this.distance <= 0) {
        this.stop()
        this.onFinish()
      }
      if (this.status === 'running') {
        this.last = new Date().getTime()
        requestAnimationFrame(this.update)
      }
    },
    start () {
      this.status = 'running'
      this.last = new Date().getTime()
      requestAnimationFrame(this.update)
    },
    stop () {
      this.status = 'stop'
      this.distance = 0
      this.save()
    },
    load () {
      this.last = localStorage.getItem('last')
      this.status = localStorage.getItem('status') || 'stop'

      if (this.status === 'running') {
        // calculate elapsed time when window closed
        const elapsedTime = (new Date().getTime() - this.last)
        this.distance = localStorage.getItem('distance') - elapsedTime
      } else if (this.status === 'pause') {
        // keep time left the same
        this.distance = localStorage.getItem('distance')
      }
    },
    save () {
      localStorage.setItem('distance', this.distance)
      localStorage.setItem('last', new Date().getTime())
      localStorage.setItem('status', this.status)
    },
    pauseResume () {
      if (this.status === 'pause') {
        this.start()
      } else if (this.status === 'running') {
        this.status = 'pause'
      }
      this.save()
    },
    startStop () {
      if (this.status === 'stop') {
        const result = confirm('คุณต้องการจะ เริ่ม การจับเวลา กดตกลงเพื่อ Reset นาฬิกา')
        if (result) {
          const hour = parseInt(document.getElementById('hour').value || 0) * 3600000
          const min = parseInt(document.getElementById('min').value || 0) * 60000
          const sec = parseInt(document.getElementById('sec').value || 0) * 1000
          this.distance = hour + min + sec
          this.start()
        }
      } else {
        const result = confirm('คุณต้องการจะ หยุด การจับเวลา กดตกลงเพื่อ Reset นาฬิกา')
        if (result) {
          this.stop()
        }
      }
      this.save()
    }
  }
})
