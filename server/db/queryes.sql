 SELECT 
          g.id,
          g.first_name,
          g.last_name,
          bg.guest_type,
          bg.check_in,
          bg.check_out,
          bg.booking_id,
          gd.document_type,
          gd.document_number,
          gd.document_issue_country,
          p.id as property_id,
          p.name as property_name,
          a.id as apartment_id,
          a.name as apartment_name,
          COALESCE(
            CASE 
              WHEN aws.status IS NOT NULL THEN aws.status
              ELSE 'pending'
            END,
            'pending'
          ) as alloggiati_status,
          NULL::uuid as parent_id
        FROM guests g
        JOIN booking_guests bg ON g.id = bg.guest_id
        JOIN bookings b ON bg.booking_id = b.id
        JOIN apartments a ON b.apartment_id = a.id
        JOIN properties p ON a.property_id = p.id
        LEFT JOIN guest_documents gd ON g.id = gd.guest_id
        LEFT JOIN alloggiati_submissions aws ON bg.alloggiati_submission_id = aws.id
        WHERE bg.guest_type IN ('group_leader', 'family_head', 'single_guest')
        AND p.user_id = 'pNkRTlI5TOarAaY6zV154LwjvuDdrJPu'
