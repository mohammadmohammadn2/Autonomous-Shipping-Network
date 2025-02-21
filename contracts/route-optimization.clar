;; Route Optimization Contract

(define-data-var next-route-id uint u0)

(define-map routes
  { id: uint }
  {
    vessel-id: uint,
    start: (string-ascii 64),
    end: (string-ascii 64),
    distance: uint
  }
)

(define-public (create-route (vessel-id uint) (start (string-ascii 64)) (end (string-ascii 64)) (distance uint))
  (let
    ((route-id (+ (var-get next-route-id) u1)))
    (var-set next-route-id route-id)
    (ok (map-set routes
      { id: route-id }
      {
        vessel-id: vessel-id,
        start: start,
        end: end,
        distance: distance
      }
    ))
  )
)

(define-read-only (get-route (id uint))
  (map-get? routes { id: id })
)

