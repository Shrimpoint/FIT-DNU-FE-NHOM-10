$(document).ready(function() {
    
    // --- CHỨC NĂNG PUBLIC: FILTER TÁC PHẨM ---
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        let filterValue = $(this).attr('data-filter');
        
        if(filterValue === 'all') {
            $('.art-item').fadeIn(300);
        } else {
            $('.art-item').hide();
            $('.art-item.' + filterValue).fadeIn(300);
        }
        
        // Relayout Masonry sau khi filter
        setTimeout(function() {
            var $grid = $('#masonry-grid').masonry({
                percentPosition: true
            });
            $grid.masonry('layout');
        }, 350);
    });

    // --- CHỨC NĂNG PUBLIC: THẢ TIM (PUT API) ---
    $('.like-btn').click(function() {
        let btn = $(this);
        let artId = btn.data('id');
        let isLiked = btn.hasClass('liked');
        
        // Mô phỏng payload
        let payload = {
            artwork_id: artId,
            action: isLiked ? 'unlike' : 'like'
        };

        // UI Update (Optimistic UI Update để người dùng thấy ngay phản hồi)
        btn.toggleClass('fa-regular fa-solid liked');

        // Gọi API bằng jQuery AJAX
        /* Bỏ comment đoạn này khi bạn có API thực tế backend bằng PHP/Node.js
        $.ajax({
            url: '/api/artworks/like', 
            type: 'PUT',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function(response) {
                console.log("Cập nhật tim thành công:", response);
            },
            error: function(err) {
                console.error("Lỗi API:", err);
                // Hoàn tác UI nếu lỗi
                btn.toggleClass('fa-regular fa-solid liked');
                alert("Không thể thả tim lúc này!");
            }
        });
        */
    });

    // --- CHỨC NĂNG ADMIN: BIỂU ĐỒ CHART.JS ---
    if ($('#likesChart').length) {
        const ctx = document.getElementById('likesChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Likes/Interactions',
                    data: [120, 190, 150, 250, 220, 300, 280],
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4 // Làm cong đường line
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#444' } },
                    x: { grid: { color: '#444' } }
                }
            }
        });
    }
});