export default function(context, inject) {
  let isLoaded = false
  let waiting = []

  addScript()
  inject('maps', { showMap, makeAutoComplete })

  function addScript() {
    const script = document.createElement('script')
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyA9StPoPj6d2S-jdP4wv9lPiXSVqWrR1_o&libraries=places&callback=initGoogleMap'
    script.async = true
    window.initGoogleMap = initGoogleMap
    document.head.appendChild(script)
  }

  function initGoogleMap() {
    isLoaded = true
    waiting.forEach(item => {
      if (typeof item.fn === 'function') {
        item.fn(...item.arguments)
      }
    })
    waiting = []
  }
  function showMap(canvas, lat, lng, homes = []) {
    if (!isLoaded) {
      waiting.push({
        fn: showMap,
        arguments
      })
      return
    }
    const position = new window.google.maps.LatLng(lat, lng)
    const mapOptions = {
      zoom: 18,
      center: position,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi.business',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        }
      ]
    }
    const map = new window.google.maps.Map(canvas, mapOptions)

    if (!homes || homes.length === 0) {
      const marker = new window.google.maps.Marker({
        position,
        clickable: false
      })
      marker.setMap(map)
      return
    }
    const bounds = new window.google.maps.LatLngBounds()

    homes.forEach(home => {
      const position = { lat: home.lat, lng: home.lng }
      const marker = new window.google.maps.Marker({
        position,
        label: {
          text: `$${home.pricePerNight}`,
          className: `marker home-${home.id}`
        },
        icon: 'https://maps.gstatic.com/mapfiles/transparent.png',
        clickable: false
      })
      marker.setMap(map)
      bounds.extend(position)
    })
    map.fitBounds(bounds)
  }
  function makeAutoComplete(input, types = ['(cities)']) {
    if (!isLoaded) {
      waiting.push({
        fn: makeAutoComplete,
        arguments
      })
      return
    }
    const autoComplete = new window.google.maps.places.Autocomplete(input, {
      types
    })
    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace()
      input.dispatchEvent(new CustomEvent('changed', { detail: place }))
    })
  }
}
