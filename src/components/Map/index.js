import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import {
  addMapLayers,
  addMapSources,
} from '../../utils/map'
import 'mapbox-gl/dist/mapbox-gl.css'
import './styles.css'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaG9va3V1IiwiYSI6ImNqYWZtc3B1bjE2ZWYzM3F1MmdqdHcxb3cifQ.Ru_O7FWsJG0xN8tpn_YiDQ'

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

class Map extends React.Component {
  constructor () {
    super()
    this.map = null
    this.el = null
  }

    handleMapLoad = () => {
      addMapSources(this.map, this.props.data)
      addMapLayers(this.map)

      this.props.onMapReady && this.props.onMapReady()
    }

    registerMapRef = (ref) => {
      this.el = ref
    }

    componentWillReceiveProps (props) {
      this.map.getSource('users').setData(props.data)
    }

    componentDidMount () {
      if (!this.el) return

      this.map = new mapboxgl.Map({
        container: this.el,
        style: 'mapbox://styles/mapbox/dark-v9',
        zoom: 1,
        center: [ 0, 25 ],
      })

      this.map.on('load', this.handleMapLoad)
    }

    render () {
      return (
        <div
          className='map'
          ref={this.registerMapRef}
        />
      )
    }
}

Map.propTypes = {
  onMapReady: PropTypes.func,
}

export default Map
