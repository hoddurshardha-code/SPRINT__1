from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import CandidateSerializer
from .models import Candidate


@api_view(['POST'])
def register_candidate(request):
    serializer = CandidateSerializer(data=request.data)

    if serializer.is_valid():
        last_candidate = Candidate.objects.order_by('-token_number').first()

        if last_candidate and last_candidate.token_number:
            next_token = last_candidate.token_number + 1
        else:
            next_token = 1

        candidate = serializer.save(token_number=next_token)

        return Response(
            {
                "message": "Candidate registered successfully",
                "candidate": CandidateSerializer(candidate).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def queue_status(request):
    candidates = Candidate.objects.order_by('token_number')

    serializer = CandidateSerializer(candidates, many=True)

    return Response(serializer.data)


@api_view(['POST'])
def next_candidate(request):

    current_serving = Candidate.objects.filter(status="Serving").first()

    if current_serving:
        return Response(
            {
                "message": "A candidate is already being served",
                "candidate": CandidateSerializer(current_serving).data
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    candidate = Candidate.objects.filter(
        status="Waiting"
    ).order_by('token_number').first()

    if candidate:
        candidate.status = "Serving"
        candidate.save()

        return Response(
            {
                "message": "Next candidate is now serving",
                "candidate": CandidateSerializer(candidate).data
            }
        )

    return Response(
        {
            "message": "No candidates are waiting"
        },
        status=status.HTTP_404_NOT_FOUND
    )


@api_view(['POST'])
def complete_candidate(request, token_number):
    try:
        candidate = Candidate.objects.get(token_number=token_number)
    except Candidate.DoesNotExist:
        return Response(
            {
                "message": "Candidate not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if candidate.status != "Serving":
        return Response(
            {
                "message": "Only a serving candidate can be completed",
                "current_status": candidate.status
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    candidate.status = "Completed"
    candidate.save()

    return Response(
        {
            "message": "Candidate completed successfully",
            "candidate": CandidateSerializer(candidate).data
        }
    )


@api_view(['POST'])
def skip_candidate(request, token_number):
    try:
        candidate = Candidate.objects.get(token_number=token_number)
    except Candidate.DoesNotExist:
        return Response(
            {
                "message": "Candidate not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if candidate.status != "Serving":
        return Response(
            {
                "message": "Only a serving candidate can be skipped",
                "current_status": candidate.status
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    candidate.status = "Skipped"
    candidate.save()

    return Response(
        {
            "message": "Candidate skipped successfully",
            "candidate": CandidateSerializer(candidate).data
        }
    )

@api_view(['GET'])
def current_candidate(request):
    candidate = Candidate.objects.filter(status="Serving").first()

    if candidate:
        return Response(
            CandidateSerializer(candidate).data
        )

    return Response(
        {
            "message": "No candidate is currently being served"
        },
        status=status.HTTP_404_NOT_FOUND
    )

@api_view(['GET'])
def queue_stats(request):
    total = Candidate.objects.count()
    waiting = Candidate.objects.filter(status="Waiting").count()
    serving = Candidate.objects.filter(status="Serving").count()
    completed = Candidate.objects.filter(status="Completed").count()
    skipped = Candidate.objects.filter(status="Skipped").count()

    return Response(
        {
            "total_candidates": total,
            "waiting": waiting,
            "serving": serving,
            "completed": completed,
            "skipped": skipped
        }
    )