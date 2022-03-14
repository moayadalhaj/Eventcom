const deleteEvent = (event) => {
  axios.delete('/events/delete/' + event.value).then(res => {
    alert('Event was deleted');
    window.location.replace('/events')
  }).catch(err => {
    console.log(err)
  })
}

// Apload avatar
const readURL = (input) => {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let image = document.getElementById('imagePlaceholder');
      image.style.display = 'block';
      image.src = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}