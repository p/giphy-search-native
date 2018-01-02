export default function rower({
  results, image_fn, container_width, padding,
}) {
  const rows = []
  let current_row = []
  let current_row_width = 0
  results.forEach(result => {
    const image = image_fn(result)
    // giphy returns dimensions as strings
    const image_width = parseInt(image.width)
    
    const delta_width = image_width + padding*2
    
    if (current_row_width + delta_width > container_width) {
      if (current_row_width > 0) {
        rows.push({index: rows.length, entries: current_row})
        current_row = []
        current_row_width = 0
      }
    }
    
    if (delta_width > container_width) {
      rows.push({index: rows.length, entries: [result]})
    } else {
      current_row.push(result)
      current_row_width += delta_width
    }
  })
  
  if (current_row.length > 0) {
    rows.push({index: rows.length, entries: current_row})
  }
    
  return rows
}
